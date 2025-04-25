import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/routing/routing_extension.dart';
import 'package:next_bus_admin/core/storage/shared_preferences_helper.dart';

import '../../../core/routing/route_constatnts.dart';
import '../../../core/routing/routing_arguments.dart';
import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/error_snackbar.dart';
import '../../../core/widgets/gradient_background.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.arguments});
  final DashboardArguments arguments;

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        drawer: Drawer(
          child: ListView(
            children: [
              ListTile(
                title: Text('Logout'),
                onTap: () async {
                  PreferencesManager preferencesManager =
                      await PreferencesManager.getInstance();
                  preferencesManager.clearAuthData();
                  if (context.mounted) {
                  showErrorSnackBar(context, 'Logged out successfully');
                    context.navigateToAndRemoveUntil(
                      RouteConstants.login,
                      arguments: LoginArguments(isLoggedIn: false),
                    );
                  }
                },
              ),
            ],
          ),
        ),
        appBar: AppBar(
          centerTitle: false,
          title: Text('Welcome, ${arguments.username}'),
          backgroundColor: Colors.transparent,
          leading: Builder(
            builder:
                (context) => IconButton(
                  icon: const Icon(Icons.menu),
                  onPressed: () {
                    Scaffold.of(context).openDrawer();
                  },
                ),
          ),
        ),
        body: Center(child: Text('Dashboard Screen')),
      ),
    );
  }
}
