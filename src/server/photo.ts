
import fs from "fs"
import path from "path"
import probe from 'probe-image-size'
import { useCurrentFlag, outPhotoDic, outPhotoSep, outPhotoDicPath } from '../utils/config'

const CURRENT_DIC = 'images'

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
const getFileMenu = (dir: string): { name: string; cover?: string; count?: number }[] => {
  const arr = fs.readdirSync(dir)
  const result: { name: string; cover?: string; count?: number }[] = []

  arr.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      // 分类名
      const name = item
      // 计算图片数量
      const files = fs.readdirSync(fullPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      const count = files.length

      // 在该目录下找 cover.jpg
      let cover = undefined
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

export const getPhotoWH = (req: any, res: any) => {
  try {
    const dic = req.query.dic || ''
    const photosDicPath = getPhotosDicPath()

    const fileList: any = []
    let photoPath = photosDicPath
    if (dic) {
      photoPath = path.join(photosDicPath, dic)
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

    const whArr: any = []
    fileList.forEach((item: any, index: number) => {
      const data = fs.readFileSync(item)
      let fileName = path.relative(photosDicPath, fileList[index])
      const { width, height }: any = probe.sync(data)
      whArr.push([width, height, fileName])
    })

    // 按前端期望的格式包装
    res.json({ data: whArr })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message })
  }
}

export const getPhotoMenu = (req: any, res: any) => {
  try {
    const photosDicPath = getPhotosDicPath()

    const fileMenu = getFileMenu(photosDicPath)

    // 按前端期望的格式包装
    res.json({ data: fileMenu })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message })
  }
}
