import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'theme_state.dart';

class ThemeCubit extends Cubit<ThemeState> {
  final SharedPreferences _prefs;
  static const String _themeKey = 'isDarkMode';

  ThemeCubit(this._prefs) : super(ThemeState(isDarkMode: _prefs.getBool(_themeKey) ?? false));

  void toggleTheme() {
    final newValue = !state.isDarkMode;
    _prefs.setBool(_themeKey, newValue);
    emit(ThemeState(isDarkMode: newValue));
  }
} 