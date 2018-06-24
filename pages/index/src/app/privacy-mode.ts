import LocalState from './local-state';
export default class PrivacyMode {
	public static isActive() {
		return LocalState.read('privacy-mode-active');
	}

	public static set(isActive: boolean) {
		LocalState.write('privacy-mode-active', isActive);
	}
}
