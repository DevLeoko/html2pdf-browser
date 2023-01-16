import { cssValueToMm, mmToPt, ptToMm, pxToMm } from "../utils/conversion-utils"
import { Document, RectOptions } from "../utils/Document"
import { PdfDocument } from "../utils/PdfDocument"
import { PositionContext } from "../utils/PositionContext"

interface ElementPrintInput {
  element: HTMLElement
  position: PositionContext
  doc: Document
  computedStyle: CSSStyleDeclaration
}

export async function elementToPdf(element: HTMLElement) {
  const doc = await PdfDocument.create()
  await printElement(element, new PositionContext(element), doc)
  return doc
}

async function printElement(element: HTMLElement, position: PositionContext, doc: Document) {
  const computedStyle = window.getComputedStyle(element)
  const elementPrintInput = { element, computedStyle, doc, position }

  printContainer(elementPrintInput)

  if (element instanceof SVGElement || element.tagName === 'IMG') {
    await printImageElement(elementPrintInput)
  } else if (element.childElementCount > 0) {
    for (const child of Array.from(element.children) as HTMLElement[]) {
      await printElement(child, position.updateForChild(child), doc)
    }
  } else {
    printTextElement(elementPrintInput)
  }
}

function printContainer(input: ElementPrintInput) {
  const { element, computedStyle, doc, position } = input

  const { x, y } = position.getPosition()
  const { width, height } = getElementSize(element)

  const backgroundColor = computedStyle.backgroundColor
  if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
    const borderRadius = cssValueToMm(computedStyle.borderRadius)
    doc.drawRect(x, y, width, height, { color: backgroundColor, borderRadius })
  }

  const borders = ['Top', 'Right', 'Bottom', 'Left'] as const
  borders.forEach((borderType) => printContainerBorder(input, borderType))
}

function printContainerBorder(
  { element, computedStyle, doc, position }: ElementPrintInput,
  borderType: 'Top' | 'Right' | 'Bottom' | 'Left'
) {
  const { x, y } = position.getPosition()
  const { width, height } = getElementSize(element)
  const borderWidth = cssValueToMm(computedStyle[`border${borderType}Width`])
  const borderColor = computedStyle[`border${borderType}Color`] as string

  if (borderWidth === 0) return

  const rectOptions: RectOptions = { color: borderColor }
  if (borderType === 'Top') {
    doc.drawRect(x, y, width, borderWidth, rectOptions)
  } else if (borderType === 'Right') {
    doc.drawRect(x + width - borderWidth, y, borderWidth, height, rectOptions)
  } else if (borderType === 'Bottom') {
    doc.drawRect(x, y + height - borderWidth, width, borderWidth, rectOptions)
  } else if (borderType === 'Left') {
    doc.drawRect(x, y, borderWidth, height, rectOptions)
  }
}

function printTextElement({ element, computedStyle, doc, position }: ElementPrintInput) {
  let { x, y } = position.getPosition()

  const text = element.innerText

  const fontSize = mmToPt(cssValueToMm(computedStyle.fontSize))
  const fontColor = computedStyle.color
  const fontWeight = Number.parseInt(computedStyle.fontWeight)

  const paddingTop = cssValueToMm(computedStyle.paddingTop)
  y += paddingTop

  const paddingLeft = cssValueToMm(computedStyle.paddingLeft)
  const paddingRight = cssValueToMm(computedStyle.paddingRight)
  let textAlignment = computedStyle.textAlign as 'center' | 'left' | 'right' | 'justify'

  const { width } = getElementSize(element)
  if (textAlignment === 'center') {
    x += (width - paddingLeft - paddingRight) / 2
  } else if (textAlignment === 'right') {
    x += width - paddingRight
  } else {
    textAlignment = 'left'
    x += paddingLeft
  }

  const lineHeightFactor = mmToPt(cssValueToMm(computedStyle.lineHeight)) / fontSize
  y += ptToMm((lineHeightFactor - 1) * fontSize)

  doc.writeText(text, x, y, {
    size: fontSize,
    color: fontColor,
    align: textAlignment,
    lineHeight: lineHeightFactor,
    weight: fontWeight
  })
}

async function printImageElement({ element, doc, position }: ElementPrintInput) {
  const { x, y } = position.getPosition()
  const { width, height } = getElementSize(element)
  await doc.drawImage(element as HTMLImageElement | SVGElement, x, y, width, height)
}

function getElementSize(element: HTMLElement): { width: number; height: number } {
  const { width, height } = element.getBoundingClientRect()
  return { width: pxToMm(width), height: pxToMm(height) }
}
