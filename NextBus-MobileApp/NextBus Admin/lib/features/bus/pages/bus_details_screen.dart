import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/widgets/gradient_background.dart';
import 'package:next_bus_admin/core/widgets/error_widget.dart';
import 'package:next_bus_admin/core/widgets/loading_widget.dart';
import 'package:next_bus_admin/core/theme/theme_cubit.dart';
import 'package:next_bus_admin/core/utils/bus_status.dart';

import '../bloc/get_bus_by_id/get_bus_by_id_bloc.dart';
import '../domain/bus_entity.dart';

class BusDetailsScreen extends StatelessWidget {
  final String id;

  const BusDetailsScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    // Load bus details when screen is first displayed
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<GetBusByIdBloc>().add(FetchBusById(id));
    });

    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text('Bus Details'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                context.read<GetBusByIdBloc>().add(FetchBusById(id));
              },
            ),
          ],
        ),
        body: BlocBuilder<GetBusByIdBloc, GetBusByIdState>(
          builder: (context, state) {
            if (state is GetBusByIdInitial || state is GetBusByIdLoading) {
              return const LoadingWidget();
            } else if (state is GetBusByIdError) {
              return ErrorWidgetView(
                errorMessage: state.message,
                onRetry: () {
                  context.read<GetBusByIdBloc>().add(FetchBusById(id));
                },
              );
            } else if (state is GetBusByIdLoaded) {
              return _buildBusDetails(context, state.bus);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildBusDetails(BuildContext context, BusEntity bus) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDetailCard(context, bus),
          const SizedBox(height: 20),
          _buildStatusInfoSection(context, bus),
          const SizedBox(height: 20),
          _buildCreationInfoSection(context, bus),
        ],
      ),
    );
  }

  Widget _buildDetailCard(BuildContext context, BusEntity bus) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  const Icon(
                    Icons.directions_bus_rounded,
                    size: 64,
                    color: Colors.blue,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    bus.busName,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  Text(
                    bus.busNumberPlate,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: getStatusColor(bus.status),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      BusStatusIdentifier.fromValue(bus.status)?.label ??
                          'Unknown',
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 32),
            _buildInfoRow(context, 'Type', '${bus.busType} ${bus.busSubType}'),
            _buildInfoRow(context, 'Owner', bus.busOwnerName),
            _buildInfoRow(context, 'Driver', bus.driverName),
            _buildInfoRow(context, 'Conductor', bus.conductorName),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusInfoSection(BuildContext context, BusEntity bus) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Status Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const Divider(),
            _buildInfoRow(
              context,
              'Current Status',
              BusStatusIdentifier.fromValue(bus.status)?.label ?? 'Unknown',
            ),
            _buildInfoRow(
              context,
              'Last Modified By',
              bus.lastModifiedBy ?? 'N/A',
            ),
            if (bus.approvedBy != null)
              _buildInfoRow(context, 'Approved By', bus.approvedBy!),
          ],
        ),
      ),
    );
  }

  Widget _buildCreationInfoSection(BuildContext context, BusEntity bus) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Creation Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const Divider(),
            _buildInfoRow(
              context,
              'Created By',
              bus.createdBy ?? 'N/A',
            ),
            _buildInfoRow(
              context,
              'Created At',
              _formatDate(bus.createdAt),
            ),
            _buildInfoRow(
              context,
              'Updated At',
              _formatDate(bus.updatedAt),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute}';
    } catch (e) {
      return dateString;
    }
  }
}