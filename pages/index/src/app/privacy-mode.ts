import LocalState from './local-state';
export default class PrivacyMode {
	public static isActive() {
		return LocalState.readDefault<boolean>('privacy-mode-active', false);
	}

	public static set(isActive: boolean) {
		LocalState.write('privacy-mode-active', isActive);
	}
}
