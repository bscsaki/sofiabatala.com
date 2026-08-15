import * as THREE from 'three'
import { useEffect, useState } from 'react'
import journalPages from '../config/journalPages'

const W = 896
const H = 1200
const INK = '#3a3050'
const INK_SOFT = '#5a5070'

function drawDoodle(ctx, kind, x, y) {
  ctx.save()
  ctx.strokeStyle = INK_SOFT
  ctx.fillStyle = INK_SOFT
  ctx.lineWidth = 3
  ctx.translate(x, y)
  switch (kind) {
    case 'star': {
      ctx.beginPath()
      for (let i = 0; i < 11; i++) {
        const r = i % 2 === 0 ? 26 : 11
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r)
      }
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'heart': {
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.bezierCurveTo(-28, -14, -8, -34, 0, -16)
      ctx.bezierCurveTo(8, -34, 28, -14, 0, 10)
      ctx.stroke()
      break
    }
    case 'check': {
      ctx.beginPath()
      ctx.moveTo(-20, 0)
      ctx.lineTo(-6, 14)
      ctx.lineTo(24, -18)
      ctx.stroke()
      break
    }
    case 'flag': {
      ctx.beginPath()
      ctx.moveTo(-10, 22)
      ctx.lineTo(-10, -22)
      ctx.lineTo(18, -14)
      ctx.lineTo(-10, -6)
      ctx.stroke()
      break
    }
    case 'plane': {
      ctx.beginPath()
      ctx.moveTo(-24, 8)
      ctx.lineTo(24, -8)
      ctx.lineTo(4, 0)
      ctx.lineTo(10, 14)
      ctx.lineTo(2, 2)
      ctx.lineTo(-24, 8)
      ctx.stroke()
      break
    }
    case 'horse': {
      // tiny toy horse silhouette, hand-drawn style
      ctx.beginPath()
      ctx.moveTo(-22, 18)
      ctx.lineTo(-22, 2)
      ctx.lineTo(-14, -6)
      ctx.lineTo(-2, -6)
      ctx.lineTo(6, -20)
      ctx.lineTo(14, -20)
      ctx.lineTo(12, -8)
      ctx.lineTo(18, 2)
      ctx.lineTo(18, 18)
      ctx.moveTo(-14, 18)
      ctx.lineTo(-14, 6)
      ctx.moveTo(10, 18)
      ctx.lineTo(10, 6)
      ctx.stroke()
      break
    }
    case 'moon': {
      ctx.beginPath()
      ctx.arc(0, 0, 22, Math.PI * 0.35, Math.PI * 1.65)
      ctx.arc(10, 0, 16, Math.PI * 1.5, Math.PI * 0.5, true)
      ctx.stroke()
      break
    }
    case 'note': {
      ctx.beginPath()
      ctx.moveTo(-8, 16)
      ctx.lineTo(-8, -18)
      ctx.lineTo(16, -24)
      ctx.lineTo(16, 10)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-14, 16, 7, 0, Math.PI * 2)
      ctx.arc(10, 10, 7, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    default:
      break
  }
  ctx.restore()
}

function buildPageCanvas(page, pageNum, paperImg) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.drawImage(paperImg, 0, 0, W, H)

  const centered = !!page.center
  const left = 120
  ctx.fillStyle = INK

  // title (blank-title pages skip the heading and underline entirely)
  if (page.title) {
    ctx.font = '64px Helvetihand, cursive'
    ctx.textAlign = centered ? 'center' : 'left'
    const titleX = centered ? W / 2 : left
    ctx.fillText(page.title, titleX, 210)
    // hand-drawn underline
    ctx.strokeStyle = INK
    ctx.lineWidth = 3
    const tw = ctx.measureText(page.title).width
    const ux = centered ? W / 2 - tw / 2 : left
    ctx.beginPath()
    ctx.moveTo(ux - 4, 234)
    ctx.quadraticCurveTo(ux + tw / 2, 242, ux + tw + 10, 232)
    ctx.stroke()
  }

  // body
  ctx.font = '44px Helvetihand, cursive'
  ctx.fillStyle = INK
  let y = 340
  for (const line of page.body) {
    ctx.fillText(line, centered ? W / 2 : left, y)
    y += 62
  }

  if (page.doodle) drawDoodle(ctx, page.doodle, W - 170, H - 190)

  // page number
  ctx.font = '34px Helvetihand, cursive'
  ctx.fillStyle = INK_SOFT
  ctx.textAlign = pageNum % 2 === 1 ? 'right' : 'left'
  ctx.fillText(String(pageNum), pageNum % 2 === 1 ? W - 80 : 80, H - 70)

  return canvas
}

export default function useJournalTextures() {
  const [textures, setTextures] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const font = new FontFace('Helvetihand', "url('/fonts/Dudu_Calligraphy.ttf')")
        await font.load()
        document.fonts.add(font)
      } catch {
        // fall back to cursive
      }
      const paperImg = await new Promise((resolve, reject) => {
        const im = new Image()
        im.onload = () => resolve(im)
        im.onerror = reject
        im.src = '/textures/paper.png'
      })
      const texs = journalPages.map((p, idx) => {
        const tex = new THREE.CanvasTexture(buildPageCanvas(p, idx + 1, paperImg))
        tex.flipY = false
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        if (idx % 2 === 1) {
          // back faces: mirror in UV space so text reads correctly from behind
          tex.wrapS = THREE.RepeatWrapping
          tex.repeat.x = -1
          tex.offset.x = 1
        }
        return tex
      })
      if (alive) setTextures(texs)
    })()
    return () => {
      alive = false
    }
  }, [])

  return textures
}
