import { jsPDF, type jsPDFOptions } from 'jspdf'
import 'svg2pdf.js'
import type { Document, RectOptions, TextOptions } from './Document'
import { addAllAvailabelFontsToPdf, getSafeFontWeight } from './font-utils'

export class PdfDocument implements Document {
	private doc: jsPDF
	private pageHeight: number
	private currentPageCount = 1
	private currentPage = 1

	static async create(options?: jsPDFOptions): Promise<PdfDocument> {
		const doc = new PdfDocument(options)
		await addAllAvailabelFontsToPdf(doc.doc)
		return doc
	}

	private constructor(options?: jsPDFOptions) {
		this.doc = new jsPDF(options)
		this.pageHeight = this.doc.internal.pageSize.getHeight()
	}

	writeText(text: string, x: number, y: number, options: TextOptions): void {
		y = this.toPageY(y)

		const { align = 'left', color = 'black', size = 12, lineHeight = 1.2 } = options
		const weight = getSafeFontWeight(options.weight ?? 400)

		this.doc
			.setFontSize(size)
			.setTextColor(color)
			.setFont('Roboto', 'normal', weight)
			.text(text, x, y, { baseline: 'top', align, lineHeightFactor: lineHeight })
	}

	drawRect(x: number, y: number, width: number, height: number, options: RectOptions): void {
		y = this.toPageY(y)

		const { color = 'black', borderRadius = 0 } = options

		this.doc.setFillColor(color)

		if (borderRadius === 0) {
			this.doc.rect(x, y, width, height, 'F')
		} else {
			this.doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'F')
		}
	}

	async drawImage(
		element: SVGElement | HTMLImageElement,
		x: number,
		y: number,
		width: number,
		height: number
	): Promise<void> {
		y = this.toPageY(y)

		if (element instanceof HTMLImageElement) {
			const src = element.getAttribute('src')
			const isSvg = src != null && src.toLowerCase().endsWith('.svg')
			if (isSvg) {
				const svg = await fetch(src).then((res) => res.text())
				// Create a new SVG element
				const svgWrapper = document.createElement('div')
				svgWrapper.innerHTML = svg

				await this.doc.svg(svgWrapper.children[0], { x, y, width, height })
			} else {
				this.doc.addImage(element as HTMLImageElement, x, y, width, height)
			}
		} else if (element instanceof SVGElement) {
			await this.doc.svg(element, { x, y, width, height })
		}
	}

	open(): void {
		this.doc.output('dataurlnewwindow')
	}

	private toPageY(y: number): number {
		const page = Math.ceil(y / this.pageHeight)

		while (this.currentPageCount < page) {
			this.doc.addPage()
			this.currentPageCount++
		}

		if (this.currentPage !== page) {
			this.doc.setPage(page)
			this.currentPage = page
		}

		return y - (page - 1) * this.pageHeight
	}
}
