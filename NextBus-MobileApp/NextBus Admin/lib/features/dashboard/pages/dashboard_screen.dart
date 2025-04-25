import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/routing/routing_extension.dart';
import 'package:next_bus_admin/core/storage/shared_preferences_helper.dart';
import 'package:next_bus_admin/core/theme/theme_cubit.dart';
import 'package:next_bus_admin/core/widgets/error_snackbar.dart';
import 'package:next_bus_admin/core/widgets/gradient_background.dart';
import 'package:next_bus_admin/core/routing/route_constatnts.dart';
import 'package:next_bus_admin/core/routing/routing_arguments.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.arguments});
  final DashboardArguments arguments;

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        drawer: _buildDrawer(context),
        appBar: AppBar(
          centerTitle: false,
          title: Text('Welcome, ${arguments.username}'),
          backgroundColor: Colors.transparent,
          leading: Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            ),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStatisticsRow(context),
              _buildQuickActions(context),
              const SizedBox(height: 24),
              _buildRecentActivity(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).primaryColor,
                  Theme.of(context).primaryColor.withValues(alpha: 0.8),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const CircleAvatar(
                  radius: 30,
                  child: Icon(Icons.person, size: 30),
                ),
                const SizedBox(height: 10),
                Text(
                  arguments.username,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'Admin',
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.directions_bus),
            title: const Text('Buses'),
            onTap: () {
              context.navigateTo(RouteConstants.bus);
            },
          ),
          ListTile(
            leading: const Icon(Icons.route),
            title: const Text('Routes'),
            onTap: () {
              // TODO: Navigate to routes screen
            },
          ),
          ListTile(
            leading: const Icon(Icons.location_on),
            title: const Text('Stops'),
            onTap: () {
              // TODO: Navigate to stops screen
            },
          ),
          ListTile(
            leading: const Icon(Icons.ad_units),
            title: const Text('Ads'),
            onTap: () {
              // TODO: Navigate to ads screen
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
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
    );
  }

  Widget _buildStatisticsRow(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      children: [
        _buildStatCard(
          context,
          'Total Buses',
          '24',
          Icons.directions_bus,
          Colors.blue,
          () {
            context.navigateTo(RouteConstants.bus);
          },
        ),
        _buildStatCard(
          context,
          'Active Routes',
          '12',
          Icons.route,
          Colors.green,
          () {
            // TODO: Navigate to routes screen
          },
        ),
        _buildStatCard(
          context,
          'Bus Stops',
          '48',
          Icons.location_on,
          Colors.orange,
          () {
            // TODO: Navigate to stops screen
          },
        ),
        _buildStatCard(
          context,
          'Active Ads',
          '8',
          Icons.ad_units,
          Colors.purple,
          () {
            // TODO: Navigate to ads screen
          },
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 40,
                color: color,
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildQuickActionButton(
                context,
                'Add Bus',
                Icons.add_circle_outline,
                Colors.blue,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildQuickActionButton(
                context,
                'Add Route',
                Icons.add_road,
                Colors.green,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActionButton(
    BuildContext context,
    String label,
    IconData icon,
    Color color,
  ) {
    return ElevatedButton.icon(
      onPressed: () {
        // TODO: Implement quick action
      },
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
    );
  }

  Widget _buildRecentActivity(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Activity',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildActivityItem(
                  'New bus added: Bus #123',
                  '2 hours ago',
                  Icons.directions_bus,
                ),
                const Divider(),
                _buildActivityItem(
                  'Route updated: Downtown Express',
                  '4 hours ago',
                  Icons.route,
                ),
                const Divider(),
                _buildActivityItem(
                  'New stop added: Central Station',
                  '1 day ago',
                  Icons.location_on,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActivityItem(String title, String time, IconData icon) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      subtitle: Text(time),
      dense: true,
    );
  }
}
