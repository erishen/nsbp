
import fs from "fs"
import path from "path"
import probe from 'probe-image-size'
import { useCurrentFlag, outPhotoDic, outPhotoSep, outPhotoDicPath } from '../utils/config'

const CURRENT_DIC = 'images'
const CURRENT_DIC_PATH = __dirname + `../../public/${CURRENT_DIC}`

let photosDic = outPhotoDic
let photosDicPath = outPhotoDicPath

if (useCurrentFlag) {
  photosDic = CURRENT_DIC
  photosDicPath = CURRENT_DIC_PATH
}

const getFileList = (dir:any, fileList:any) =>{
  const arr = fs.readdirSync(dir)

  arr.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      getFileList(fullPath, fileList)
    } else {
      fileList.push(fullPath)
    }
  })
  return fileList
}

const getFileMenu = (dir:any, fileMenu:any) => {
  const arr = fs.readdirSync(dir)

  arr.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      fileMenu.push(item)
    }
  })

  return fileMenu
}

export const getPhotoWH = (dic:any) => {
  const fileList: any = []
  let photoPath = photosDicPath
  if (dic) {
    photoPath = `${photosDicPath}${outPhotoSep}${dic}`
  }
  getFileList(photoPath, fileList)
  console.log('fileList', fileList)

  const whArr:any = []
  fileList.forEach((item:any, index:number) => {
    const data = fs.readFileSync(item)
    let fileName:string = fileList[index]
    fileName = fileName.substring(fileName.lastIndexOf(`${photosDic}${outPhotoSep}`) + photosDic.length + 1)

    const { width, height }:any = probe.sync(data)
    whArr.push([width, height, fileName])
  })
  console.log('whArr', whArr)
  return whArr
}

export const getPhotoMenu = () => {
  const fileMenu:any = []
  getFileMenu(photosDicPath, fileMenu)
  console.log('fileMenu', fileMenu)

  return fileMenu
}