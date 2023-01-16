const PX_TO_MM = 0.2645833333333333

export function pxToMm(px: number) {
	return px * PX_TO_MM
}

export function mmToPx(mm: number) {
	return mm / PX_TO_MM
}

export function mmToPt(px: number) {
	return px * 2.835
}

export function ptToMm(pt: number) {
	return pt / 2.835
}

export function cssValueToMm(cssValue: string) {
	// split value and unit
	const [val, unit] = cssValue.split(/([a-zA-Z%]+)$/i)

	const value = Number.parseFloat(val)
	if (!unit) return pxToMm(value)

	// in, em, rem, pt might be wrong

	switch (unit) {
		case 'mm':
			return value
		case 'cm':
			return value * 10
		case 'in':
			return value * 25.4
		case 'px':
			return pxToMm(value)
		case 'pt':
			return value / 2.835
		case 'em':
			return value * 3.5433070866
		case 'rem':
			return value * 3.5433070866
		case 'vw':
			return (value / 100) * window.innerWidth * PX_TO_MM
		case 'vh':
			return (value / 100) * window.innerWidth * PX_TO_MM
		case 'vmin':
			return (value / 100) * Math.min(window.innerWidth, window.innerHeight) * PX_TO_MM
		case 'vmax':
			return (value / 100) * Math.max(window.innerWidth, window.innerHeight) * PX_TO_MM
		default:
			throw new Error('Unknown unit')
	}

	// Old to px conversion
	// switch (unit) {
	// 	case 'px':
	// 		return value
	// 	case 'pt':
	// 		return value * 0.75
	// 	case 'em':
	// 		return value * 16
	// 	case 'rem':
	// 		return value * 16
	// 	case 'vw':
	// 		return value * 0.01 * window.innerWidth
	// 	case 'vh':
	// 		return value * 0.01 * window.innerHeight
	// 	case 'vmin':
	// 		return value * 0.01 * Math.min(window.innerWidth, window.innerHeight)
	// 	case 'vmax':
	// 		return value * 0.01 * Math.max(window.innerWidth, window.innerHeight)
	// 	default:
	// 		return value
	// }
}
