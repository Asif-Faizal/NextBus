import 'package:flutter/material.dart';

class AppTheme {
  static const lightGradientStart = Color.fromARGB(255, 222, 255, 255);
  static const lightGradientEnd = Colors.white;
  static const darkGradientStart = Color.fromARGB(255, 15, 21, 21);
  static const darkGradientEnd = Color.fromARGB(255, 24, 34, 34);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: const Color(0xFF008080), // Light teal
      secondary: const Color(0xFF006666),
      surface: lightGradientStart,
      error: Colors.red.shade800,
    ),
    fontFamily: 'Montserrat',
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontWeight: FontWeight.w900),
      displayMedium: TextStyle(fontWeight: FontWeight.w900),
      displaySmall: TextStyle(fontWeight: FontWeight.w900),
      headlineLarge: TextStyle(fontWeight: FontWeight.w900),
      headlineMedium: TextStyle(fontWeight: FontWeight.w900),
      headlineSmall: TextStyle(fontWeight: FontWeight.w900),
      titleLarge: TextStyle(fontWeight: FontWeight.w900),
      titleMedium: TextStyle(fontWeight: FontWeight.w900),
      titleSmall: TextStyle(fontWeight: FontWeight.w900),
      bodyLarge: TextStyle(fontWeight: FontWeight.w900),
      bodyMedium: TextStyle(fontWeight: FontWeight.w900),
      bodySmall: TextStyle(fontWeight: FontWeight.w500),
      labelLarge: TextStyle(fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontWeight: FontWeight.w500),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: lightGradientStart,
      foregroundColor: Colors.black87,
    ),
    cardTheme: CardTheme(
      color: Colors.white.withOpacity(0.9),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    scaffoldBackgroundColor: lightGradientStart,
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: const Color(0xFF008080), // Teal
      secondary: const Color(0xFF00B3B3),
      surface: darkGradientStart,
      error: Colors.red.shade800,
    ),
    fontFamily: 'Montserrat',
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontWeight: FontWeight.w900),
      displayMedium: TextStyle(fontWeight: FontWeight.w900),
      displaySmall: TextStyle(fontWeight: FontWeight.w900),
      headlineLarge: TextStyle(fontWeight: FontWeight.w900),
      headlineMedium: TextStyle(fontWeight: FontWeight.w900),
      headlineSmall: TextStyle(fontWeight: FontWeight.w900),
      titleLarge: TextStyle(fontWeight: FontWeight.w900),
      titleMedium: TextStyle(fontWeight: FontWeight.w900),
      titleSmall: TextStyle(fontWeight: FontWeight.w900),
      bodyLarge: TextStyle(fontWeight: FontWeight.w900),
      bodyMedium: TextStyle(fontWeight: FontWeight.w900),
      bodySmall: TextStyle(fontWeight: FontWeight.w500),
      labelLarge: TextStyle(fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontWeight: FontWeight.w500),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: darkGradientStart,
      foregroundColor: Colors.white,
    ),
    cardTheme: CardTheme(
      color: darkGradientEnd.withOpacity(0.9),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    scaffoldBackgroundColor: darkGradientStart,
  );
} 