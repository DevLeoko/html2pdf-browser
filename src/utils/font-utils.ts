import type jsPDF from 'jspdf'

const DEFAULT_FONTS = [
	{
		family: 'Roboto',
		weight: 100,
		style: 'normal',
		src: 'Roboto-Thin.ttf'
	},
	{
		family: 'Roboto',
		weight: 100,
		style: 'italic',
		src: 'Roboto-ThinItalic.ttf'
	},
	{
		family: 'Roboto',
		weight: 300,
		style: 'normal',
		src: 'Roboto-Light.ttf'
	},
	{
		family: 'Roboto',
		weight: 300,
		style: 'italic',
		src: 'Roboto-LightItalic.ttf'
	},
	{
		family: 'Roboto',
		weight: 400,
		style: 'normal',
		src: 'Roboto-Regular.ttf'
	},
	{
		family: 'Roboto',
		weight: 400,
		style: 'italic',
		src: 'Roboto-Italic.ttf'
	},
	{
		family: 'Roboto',
		weight: 500,
		style: 'normal',
		src: 'Roboto-Medium.ttf'
	},
	{
		family: 'Roboto',
		weight: 500,
		style: 'italic',
		src: 'Roboto-MediumItalic.ttf'
	},
	{
		family: 'Roboto',
		weight: 700,
		style: 'normal',
		src: 'Roboto-Bold.ttf'
	},
	{
		family: 'Roboto',
		weight: 700,
		style: 'italic',
		src: 'Roboto-BoldItalic.ttf'
	},
	{
		family: 'Roboto',
		weight: 900,
		style: 'normal',
		src: 'Roboto-Black.ttf'
	},
	{
		family: 'Roboto',
		weight: 900,
		style: 'italic',
		src: 'Roboto-BlackItalic.ttf'
	}
]

export const AVAILABLE_FONT_WEIGHTS = [...new Set(DEFAULT_FONTS.map((font) => font.weight))]

async function fetchAndEncode(fileUrl: string): Promise<string> {
	const response = await fetch(fileUrl)
	const arrayBuffer = await response.arrayBuffer()
	let binary = ''
	const bytes = new Uint8Array(arrayBuffer)
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return window.btoa(binary)
}

export async function addAllAvailabelFontsToPdf(pdf: jsPDF) {
	for (const font of DEFAULT_FONTS) {
		const fontData = await fetchAndEncode(`/fonts/${font.src}`)
		pdf.addFileToVFS(font.src, fontData)
		pdf.addFont(font.src, font.family, font.style, font.weight)
	}
}

export function getSafeFontWeight(weight: number) {
	if (AVAILABLE_FONT_WEIGHTS.includes(weight)) return weight

	const modifier = weight > 400 ? -100 : 100

	let safety = 0
	while (!AVAILABLE_FONT_WEIGHTS.includes(weight)) {
		weight += modifier
		safety++
		if (safety > 10) break
	}

	return weight
}
