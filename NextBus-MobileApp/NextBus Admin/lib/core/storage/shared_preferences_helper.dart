import 'package:shared_preferences/shared_preferences.dart';

class PreferencesManager {
  static PreferencesManager? _instance;
  static SharedPreferences? _preferences;

  // Keys
  static const String keyTheme = 'isDarkMode';
  static const String keyLanguage = 'languageCode';

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
}