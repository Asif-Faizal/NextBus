import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;
  final bool isDarkMode;

  const GradientBackground({
    super.key,
    required this.child,
    required this.isDarkMode,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDarkMode
              ? [
                  AppTheme.darkGradientStart,
                  AppTheme.darkGradientEnd,
                ]
              : [
                  AppTheme.lightGradientStart,
                  AppTheme.lightGradientEnd,
                ],
        ),
      ),
      child: child,
    );
  }
} 