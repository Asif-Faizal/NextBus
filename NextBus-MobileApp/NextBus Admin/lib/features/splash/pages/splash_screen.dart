import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/routing/route_constatnts.dart';
import '../../../core/routing/routing_extension.dart';
import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/gradient_background.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToLogin();
  }

  void _navigateToLogin() {
    Timer(const Duration(seconds: 2), () {
      context.navigateToAndRemoveUntil(RouteConstants.login);
    });
  }

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'NextBus Admin',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              const CircularProgressIndicator(),
            ],
          ),
        ),
      ),
    );
  }
}
