export interface TextOptions {
	align?: 'left' | 'center' | 'right'
	color?: string
	weight?: number
	size?: number
	lineHeight?: number
}

export interface RectOptions {
	color?: string
	borderRadius?: number
}

export interface Document {
	writeText(text: string, x: number, y: number, options: TextOptions): void
	drawRect(x: number, y: number, width: number, height: number, options: RectOptions): void
	drawImage(
		element: HTMLImageElement | SVGElement,
		x: number,
		y: number,
		width: number,
		height: number
	): Promise<void>
	open(): void
}
