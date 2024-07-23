<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface ImageData {
  url: string
  height: number
  width: number
}

const images = ref<ImageData[]>([])
const upFiles = ref<UploadUserFile[]>([])
const mergedImage = ref<string | null>(null)
const cropHeightPercent = ref<number>(15)
const isMerging = ref(false)

const handlePicFile = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          url: e.target?.result as string,
          height: img.height,
          width: img.width
        })
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFiles = async (uploadFiles: UploadUserFile[]) => {
  console.log(images)
  const tempImages: ImageData[] = []
  for (const file of uploadFiles) {
    const imageData = await handlePicFile(file.raw as File)
    tempImages.push(imageData)
  }
  images.value = tempImages
}

const mergeImages = async () => {
  if (upFiles.value.length < 1) {
    messageError('请先上传图片')
    return
  }
  isMerging.value = true
  try {
    await handleFiles(upFiles.value)

    const baseImage = new Image()
    baseImage.src = images.value[0].url
    await new Promise((resolve) => {
      baseImage.onload = resolve
    })

    const cropHeight = baseImage.height * (cropHeightPercent.value / 100)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    // Set canvas width to the width of the first image
    canvas.width = baseImage.width
    // Set canvas height to the height of the first image plus the cropped heights of all subsequent images
    canvas.height = baseImage.height + cropHeight * (images.value.length - 1)

    // Draw the first image in its entirety
    context.drawImage(baseImage, 0, 0)

    // Draw each subsequent image cropped from the bottom
    let currentHeight = baseImage.height
    for (let i = 1; i < images.value.length; i++) {
      const img = new Image()
      img.src = images.value[i].url
      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Draw the cropped part of each image at the current height
      context.drawImage(
        img,
        0,
        img.height - cropHeight,
        img.width,
        cropHeight,
        0,
        currentHeight,
        img.width,
        cropHeight
      )
      currentHeight += cropHeight
    }

    // Convert the canvas content to a data URL and store it in mergedImage
    mergedImage.value = canvas.toDataURL('image/png')
    messageSuccess('图片处理成功')
  } catch (error) {
    messageError('图片处理失败')
  } finally {
    isMerging.value = false
  }
}

const clearImages = () => {
  images.value = []
  upFiles.value = []
  mergedImage.value = null
}

const copyImage = async () => {
  if (!mergedImage.value) {
    messageError('No image to copy.')
    return
  }
  try {
    const blob = await (await fetch(mergedImage.value)).blob()
    const clipboardItem = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([clipboardItem])
    messageSuccess('复制成功')
  } catch (err) {
    messageError('复制失败')
  }
}

const saveImage = () => {
  if (!mergedImage.value) {
    messageError('No image to save.')
    return
  }
  const link = document.createElement('a')
  link.href = mergedImage.value
  const firstFileName = upFiles.value[0].name.split('.').slice(0, -1).join('.')
  link.download = `sakiko-merged-${firstFileName}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const messageSuccess = (message: string) => {
  ElMessage({
    type: 'success',
    offset: 66,
    message
  })
}
const messageError = (message: string) => {
  ElMessage({
    type: 'error',
    offset: 66,
    message
  })
}

const couldShowClearBtn = computed(() => {
  if (
    images.value.length === 0 &&
    upFiles.value.length === 0 &&
    mergedImage.value === null
  ) {
    return false
  }
  return true
})
const couldShowMergeBtn = computed(() => {
  if (upFiles.value.length === 0) {
    return false
  }
  return true
})
</script>

<template>
  <div class="utils-page">
    <h2>字幕拼接小工具🎬</h2>
    <div>
      <div class="upload">
        <el-upload
          multiple
          :auto-upload="false"
          accept="image/*"
          v-model:file-list="upFiles"
          list-type="picture-card"
        >
          <el-icon class="uploader-icon"><Plus /></el-icon>
          <span class="uploader-text">添加图片</span>
        </el-upload>
      </div>
      <div>
        <el-text tag="b" size="large"> 字幕截取高度（百分比） </el-text>
        <el-slider
          class="crop-height-slider"
          v-model="cropHeightPercent"
          :min="0"
          :max="100"
        />
      </div>
      <div class="btn-box">
        <el-button
          type="warning"
          @click="mergeImages"
          :loading="isMerging"
          v-if="couldShowMergeBtn"
        >
          生成
        </el-button>
        <template v-if="mergedImage">
          <el-button type="info" @click="copyImage"> 复制 </el-button>
          <el-button type="success" @click="saveImage"> 保存 </el-button>
        </template>
        <el-button type="danger" @click="clearImages" v-if="couldShowClearBtn">
          清空
        </el-button>
      </div>
      <div class="merged-image-box" v-if="mergedImage">
        <el-image class="merged-image" :src="mergedImage" />
      </div>
    </div>
    <el-divider class="utils-divider" />
  </div>
</template>

<style lang="scss" scoped>
.utils-page {
  max-width: 1030px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  font-size: 16px;
  h2 {
    color: var(--color-heading);
    margin: 20px 5px 10px 5px;
    font-weight: bold;
    transition: all 0.5s;
    text-align: center;
  }
}
$upload-img-width: 240px;
$upload-img-height: 135px;
.upload {
  :deep() {
    .el-upload-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
      .el-upload-list__item {
        width: $upload-img-width;
        height: $upload-img-height;
        display: flex;
        margin: 8px;
        background-color: var(--color-background);
        transition: all 0.5s;
        img {
          background-color: transparent;
        }
      }
    }
    .el-upload {
      width: $upload-img-width;
      height: $upload-img-height;
      margin: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition:
        border var(--el-transition-duration),
        background-color 0.5s;
      color: #8c939d;
      &:hover {
        border-color: var(--el-color-primary);
      }
      .uploader-icon {
        font-size: 28px;
      }
      .uploader-text {
        font-weight: bold;
        margin-left: 10px;
      }
    }
    .el-upload-list__item-thumbnail {
      background-color: var(--el-fill-color-blank);
    }
  }
}
.crop-height-slider {
  :deep() {
    .el-slider__runway {
      transition: all 0.5s;
    }
  }
}
.btn-box {
  display: flex;
  justify-content: center;
  margin: 10px 10px 0 10px;
}
.merged-image-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .merged-image {
    border-radius: 20px;
  }
}

.utils-divider {
  transition: all 0.5s;
}
</style>
