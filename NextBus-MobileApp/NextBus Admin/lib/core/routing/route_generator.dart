import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/routing/route_constatnts.dart';
import 'package:next_bus_admin/features/login/pages/login_screen.dart';

import '../../features/dashboard/pages/dashboard_screen.dart';
import '../../features/splash/pages/splash_screen.dart';
import '../theme/theme_cubit.dart';
import '../widgets/gradient_background.dart';
import 'routing_arguments.dart';

class RouteGenerator {
  /// Route generation method that returns the appropriate route
  static Route<dynamic> generateRoute(
    RouteSettings settings,
    BuildContext context,
  ) {
    // Get arguments passed to the route
    final args = settings.arguments;

    switch (settings.name) {
      case RouteConstants.splash:
        return _buildRoute(const SplashScreen(), settings);
      case RouteConstants.login:
        return _buildRoute(LoginScreen(), settings);
      case RouteConstants.dashboard:
        return _buildRoute(
          DashboardScreen(arguments: args as DashboardArguments),
          settings,
        );
      default:
        return _errorRoute('Route not found: ${settings.name}', context);
    }
  }

  static Route<dynamic> _buildRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.ease;
        var tween = Tween(
          begin: begin,
          end: end,
        ).chain(CurveTween(curve: curve));
        return SlideTransition(position: animation.drive(tween), child: child);
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }

  /// Helper method to create an error route
  static Route<dynamic> _errorRoute(String message, BuildContext context) {
    final isDarkMode = context.read<ThemeCubit>().state.isDarkMode;
    return MaterialPageRoute(
      builder:
          (_) => GradientBackground(
            isDarkMode: isDarkMode,
            child: Scaffold(
              appBar: AppBar(title: const Text('Error')),
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    message,
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
          ),
    );
  }
}
