import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../storage/shared_preferences_helper.dart';

part 'theme_state.dart';

class ThemeCubit extends Cubit<ThemeState> {
  ThemeCubit() : super(ThemeState(isDarkMode: PreferencesManager.defaultTheme)) {
    _initializeTheme();
  }

  Future<void> _initializeTheme() async {
    final prefsManager = await PreferencesManager.getInstance();
    emit(ThemeState(isDarkMode: prefsManager.isDarkMode));
  }

  Future<void> toggleTheme() async {
    final prefsManager = await PreferencesManager.getInstance();
    final newValue = !state.isDarkMode;
    await prefsManager.setDarkMode(newValue);
    emit(ThemeState(isDarkMode: newValue));
  }
} 