import 'package:flutter/material.dart';

class AppTheme {
  static const lightGradientStart = Color.fromARGB(255, 215, 233, 235);
  static const lightGradientEnd = Colors.white;
  static const darkGradientStart = Color.fromARGB(255, 15, 21, 21);
  static const darkGradientEnd = Color.fromARGB(255, 24, 34, 34);

  static InputDecorationTheme _getInputDecorationTheme(bool isDark) {
    return InputDecorationTheme(
      filled: true,
      fillColor: isDark 
          ? darkGradientEnd.withValues(alpha:0.7)
          : Colors.white.withValues(alpha:0.9),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: isDark ? Colors.white24 : Colors.black12,
          width: 1,
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(
          color: isDark ? Colors.white24 : Colors.black12,
          width: 1,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(
          color: isDark ? const Color.fromARGB(255, 0, 87, 87) :  const Color.fromARGB(255, 0, 242, 255),
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(
          color: Colors.red.shade800,
          width: 1,
        ),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(
          color: Colors.red.shade800,
          width: 2,
        ),
      ),
      hintStyle: TextStyle(
        color: isDark ? Colors.white60 : Colors.black54,
        fontSize: 16,
      ),
      labelStyle: TextStyle(
        color: isDark ? Colors.white70 : Colors.black87,
        fontSize: 16,
      ),
      errorStyle: TextStyle(
        color: Colors.red.shade800,
        fontSize: 14,
      ),
    );
  }

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: const Color(0xFF008080), // Light teal
      secondary: const Color(0xFF006666),
      surface: lightGradientStart,
      error: Colors.red.shade800,
    ),
    inputDecorationTheme: _getInputDecorationTheme(false),
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
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.black87,
    ),
    cardTheme: CardTheme(
      color: Colors.white.withValues(alpha:0.9),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(5),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        backgroundColor: const Color(0xFF008080),
        foregroundColor: Colors.white,
        elevation: 2,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(5),
        ),
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
    inputDecorationTheme: _getInputDecorationTheme(true),
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
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      color: darkGradientEnd.withValues(alpha:0.9),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(5),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        backgroundColor: const Color(0xFF00B3B3),
        foregroundColor: Colors.white,
        elevation: 2,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(5),
        ),
      ),
    ),
    scaffoldBackgroundColor: Colors.transparent,
  );
} 