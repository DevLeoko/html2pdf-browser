import { pxToMm } from './conversion-utils'

export class PositionContext {
	private element: HTMLElement

	constructor(
		public wrapper: HTMLElement,
		element?: HTMLElement,
	) {
		this.element = element ?? wrapper
	}

	updateForChild(element: HTMLElement): PositionContext {
		return new PositionContext(this.wrapper, element)
	}

	getPosition() {
		const { top, left } = this.element.getBoundingClientRect()
		const { top: wrapperTop, left: wrapperLeft } = this.wrapper.getBoundingClientRect()

		return { x: pxToMm(left - wrapperLeft), y: pxToMm(top - wrapperTop) }
	}
}
