import { pxToMm } from './conversion-utils'

export class PositionContext {
	private offsetParentX: number
	private offsetParentY: number
	private offsetParent: HTMLElement
	private myX: number
	private myY: number

	constructor(
		wrapper: HTMLElement,
		offsetParentX?: number,
		offsetParentY?: number,
		myX?: number,
		myY?: number
	) {
		this.offsetParentX = offsetParentX ?? 0
		this.offsetParentY = offsetParentY ?? 0
		this.myX = myX ?? 0
		this.myY = myY ?? 0
		this.offsetParent = wrapper
	}

	updateForChild(element: HTMLElement): PositionContext {
		if (!element.offsetParent) return new PositionContext(element, 0, 0, 0, 0)
		if (!(element.offsetParent instanceof HTMLElement))
			throw new Error('offsetParent is not an HTMLElement')

		const parentChanged = this.offsetParent !== element.offsetParent
		const newOffsetParent = element.offsetParent
		return new PositionContext(
			newOffsetParent,
			parentChanged ? this.offsetParentX + newOffsetParent.offsetLeft : this.offsetParentX,
			parentChanged ? this.offsetParentY + newOffsetParent.offsetTop : this.offsetParentY,
			element.offsetLeft,
			element.offsetTop
		)
	}

	getPosition() {
		return { x: pxToMm(this.offsetParentX + this.myX), y: pxToMm(this.offsetParentY + this.myY) }
	}
}
