import 'package:shared_preferences/shared_preferences.dart';

class PreferencesManager {
  static PreferencesManager? _instance;
  static SharedPreferences? _preferences;

  // Keys
  static const String keyTheme = 'isDarkMode';
  static const String keyLanguage = 'languageCode';
  static const String keyUserID = 'userID';
  static const String keyUsername = 'username';
  static const String keyUserType = 'userType';
  static const String keyIsLoggedIn = 'isLoggedIn';
  static const String keyJWTToken = 'jwtToken';
  static const String keyRefreshToken = 'refreshToken';

  // Default values
  static const bool defaultTheme = false;
  static const String defaultLanguage = 'en';
  PreferencesManager._();

  static Future<PreferencesManager> getInstance() async {
    if (_instance == null) {
      _instance = PreferencesManager._();
      _preferences = await SharedPreferences.getInstance();
    }
    return _instance!;
  }

  // Theme preferences
  bool get isDarkMode => _preferences?.getBool(keyTheme) ?? defaultTheme;

  Future<void> setDarkMode(bool value) async {
    await _preferences?.setBool(keyTheme, value);
  }

  // Language preferences
  String get languageCode =>
      _preferences?.getString(keyLanguage) ?? defaultLanguage;

  Future<void> setLanguageCode(String value) async {
    await _preferences?.setString(keyLanguage, value);
  }

  // User preferences
  String get userID => _preferences?.getString(keyUserID) ?? '';
  Future<void> setUserID(String value) async {
    await _preferences?.setString(keyUserID, value);
  }

  String get username => _preferences?.getString(keyUsername) ?? '';
  Future<void> setUsername(String value) async {
    await _preferences?.setString(keyUsername, value);
  }

  String get userType => _preferences?.getString(keyUserType) ?? '';
  Future<void> setUserType(String value) async {
    await _preferences?.setString(keyUserType, value);
  }

  bool get isLoggedIn => _preferences?.getBool(keyIsLoggedIn) ?? false;
  Future<void> setIsLoggedIn(bool value) async {
    await _preferences?.setBool(keyIsLoggedIn, value);
  }

  String get jwtToken => _preferences?.getString(keyJWTToken) ?? '';
  Future<void> setJWTToken(String value) async {
    await _preferences?.setString(keyJWTToken, value);
  }

  String get refreshToken => _preferences?.getString(keyRefreshToken) ?? '';
  Future<void> setRefreshToken(String value) async {
    await _preferences?.setString(keyRefreshToken, value);
  }

  Future<void> clearAuthData() async {
    await _preferences?.remove(keyUserID);
    await _preferences?.remove(keyUsername);
    await _preferences?.remove(keyUserType);
    await _preferences?.remove(keyIsLoggedIn);
    await _preferences?.remove(keyJWTToken);
    await _preferences?.remove(keyRefreshToken);
  }
}
