export default class StringHelper {
	public static padEnd(str: string, pad: string, len: number) {
		while (str.length < len) {
			str += pad;
		}
		return str;
	}
	public static padStart(str: string, pad: string, len: number) {
		while (str.length < len) {
			str = pad + str;
		}
		return str;
	}
}
