import fs from 'fs'
import path from 'path'
import probe from 'probe-image-size'

// 获取项目根目录（无论从哪个目录运行服务器）
const getProjectRoot = () => {
  let currentDir = __dirname
  const maxIterations = 10
  let iterations = 0

  while (iterations < maxIterations) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
    iterations++
  }
  return process.cwd()
}

const getPublicImagesPath = () => {
  return path.join(getProjectRoot(), 'public/images')
}

const getPhotosDicPath = () => {
  return getPublicImagesPath()
}

// 获取目录下的子目录（分类），并为每个分类找封面图和图片数量
const getFileMenu = (
  dir: string
): { name: string; cover?: string; count?: number }[] => {
  const arr = fs.readdirSync(dir)
  const result: { name: string; cover?: string; count?: number }[] = []

  arr.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      // 分类名
      const name = item
      // 计算图片数量
      const files = fs
        .readdirSync(fullPath)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      const count = files.length

      // 在该目录下找 cover.jpg
      let cover = ''
      const coverPath = path.join(fullPath, 'cover.jpg')
      if (fs.existsSync(coverPath)) {
        // 转成相对 public 的 URL 路径
        cover = `/images/${item}/cover.jpg`
      } else if (files.length > 0) {
        // 否则找第一张图片
        cover = `/images/${item}/${files[0]}`
      }
      result.push({ name, cover, count })
    }
  })
  return result
}

interface Request {
  query: { dic?: string }
}

interface Response {
  status: (code: number) => Response
  json: (data: unknown) => void
}

export const getPhotoWH = (req: Request, res: Response) => {
  try {
    const dic = req.query.dic || ''
    const photosDicPath = getPhotosDicPath()

    // 验证 dic 参数，只允许字母数字、下划线和短横线
    if (dic && !/^[a-zA-Z0-9_-]+$/.test(dic)) {
      return res.status(400).json({ error: 'Invalid directory name' })
    }

    const fileList: string[] = []
    let photoPath = photosDicPath
    if (dic) {
      photoPath = path.join(photosDicPath, dic)
    }

    // 确保路径在允许的目录内，防止路径遍历攻击
    const resolvedPhotoPath = path.resolve(photoPath)
    const resolvedPhotosDicPath = path.resolve(photosDicPath)
    if (!resolvedPhotoPath.startsWith(resolvedPhotosDicPath)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // 检查目录是否存在
    if (!fs.existsSync(photoPath)) {
      return res
        .status(404)
        .json({ error: 'Directory not found', details: photoPath })
    }

    const getFileList = (dir: string, list: string[]) => {
      const arr = fs.readdirSync(dir)
      arr.forEach((item) => {
        const fullPath = path.join(dir, item)
        const stats = fs.statSync(fullPath)
        if (stats.isDirectory()) {
          getFileList(fullPath, list)
        } else {
          list.push(fullPath)
        }
      })
      return list
    }

    getFileList(photoPath, fileList)

    const whArr: [number, number, string][] = []
    fileList.forEach((item: string, index: number) => {
      const data = fs.readFileSync(item)
      let fileName = path.relative(photosDicPath, fileList[index])
      const result = probe.sync(data)
      const width = result?.width ?? 0
      const height = result?.height ?? 0
      whArr.push([width, height, fileName])
    })

    // 按前端期望的格式包装
    res.json({ data: whArr })
  } catch (err) {
    const error = err as Error
    console.error('getPhotoWH error:', error)
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message })
  }
}

export const getPhotoMenu = (_req: Request, res: Response) => {
  try {
    const photosDicPath = getPhotosDicPath()

    const fileMenu = getFileMenu(photosDicPath)

    // 按前端期望的格式包装
    res.json({ data: fileMenu })
  } catch (err) {
    const error = err as Error
    console.error('getPhotoMenu error:', error)
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message })
  }
}
