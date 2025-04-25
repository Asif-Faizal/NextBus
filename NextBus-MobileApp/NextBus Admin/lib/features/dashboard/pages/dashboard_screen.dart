import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/routing/routing_arguments.dart';
import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/gradient_background.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.arguments});
  final DashboardArguments arguments;

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        appBar: AppBar(
          centerTitle: false,
          title: Text('Welcome, ${arguments.username}'),
          backgroundColor: Colors.transparent,
        ),
        body: Center(child: Text('Dashboard Screen')),
      ),
    );
  }
}
