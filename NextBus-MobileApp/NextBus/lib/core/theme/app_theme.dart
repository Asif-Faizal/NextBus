import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: const Color(0xFF008080), // Light teal
      secondary: const Color(0xFF006666),
      surface: Colors.white,
      background: const Color(0xFFF5F5F5),
      error: Colors.red,
    ),
    fontFamily: 'Montserrat',
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontWeight: FontWeight.w700),
      displayMedium: TextStyle(fontWeight: FontWeight.w700),
      displaySmall: TextStyle(fontWeight: FontWeight.w700),
      headlineLarge: TextStyle(fontWeight: FontWeight.w600),
      headlineMedium: TextStyle(fontWeight: FontWeight.w600),
      headlineSmall: TextStyle(fontWeight: FontWeight.w600),
      titleLarge: TextStyle(fontWeight: FontWeight.w600),
      titleMedium: TextStyle(fontWeight: FontWeight.w600),
      titleSmall: TextStyle(fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(fontWeight: FontWeight.w500),
      bodyMedium: TextStyle(fontWeight: FontWeight.w500),
      bodySmall: TextStyle(fontWeight: FontWeight.w500),
      labelLarge: TextStyle(fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontWeight: FontWeight.w500),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF008080),
      foregroundColor: Colors.white,
    ),
    cardTheme: CardTheme(
      color: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: const Color(0xFF008080), // Teal
      secondary: const Color(0xFF00B3B3),
      surface: const Color(0xFF1E1E1E),
      background: const Color(0xFF121212),
      error: Colors.red,
    ),
    fontFamily: 'Montserrat',
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontWeight: FontWeight.w700),
      displayMedium: TextStyle(fontWeight: FontWeight.w700),
      displaySmall: TextStyle(fontWeight: FontWeight.w700),
      headlineLarge: TextStyle(fontWeight: FontWeight.w600),
      headlineMedium: TextStyle(fontWeight: FontWeight.w600),
      headlineSmall: TextStyle(fontWeight: FontWeight.w600),
      titleLarge: TextStyle(fontWeight: FontWeight.w600),
      titleMedium: TextStyle(fontWeight: FontWeight.w600),
      titleSmall: TextStyle(fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(fontWeight: FontWeight.w500),
      bodyMedium: TextStyle(fontWeight: FontWeight.w500),
      bodySmall: TextStyle(fontWeight: FontWeight.w500),
      labelLarge: TextStyle(fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontWeight: FontWeight.w500),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1E1E1E),
      foregroundColor: Colors.white,
    ),
    cardTheme: CardTheme(
      color: const Color(0xFF1E1E1E),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
  );
} 