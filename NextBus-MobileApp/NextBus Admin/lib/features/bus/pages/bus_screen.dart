import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/widgets/gradient_background.dart';
import 'package:next_bus_admin/core/widgets/error_widget.dart';
import 'package:next_bus_admin/core/widgets/loading_widget.dart';
import 'package:next_bus_admin/features/bus/bloc/get_bus_list/get_bus_list_bloc.dart';
import 'package:next_bus_admin/features/bus/data/bus_request_model.dart';

import '../../../core/theme/theme_cubit.dart';
import '../../../core/utils/bus_status.dart';

class BusScreen extends StatelessWidget {
  const BusScreen({super.key});

  static const int _limit = 5;

  void _loadBuses(BuildContext context, int page) {
    context.read<GetBusListBloc>().add(
      FetchBuses(
        BusRequestModel(
          busType: '',
          busSubType: '',
          busName: '',
          page: page,
          limit: _limit,
        ),
      ),
    );
  }

  void _refreshBuses(BuildContext context) {
    _loadBuses(context, 1);
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create:
          (context) =>
              context.read<GetBusListBloc>()..add(
                FetchBuses(
                  BusRequestModel(
                    busType: '',
                    busSubType: '',
                    busName: '',
                    page: 1,
                    limit: _limit,
                  ),
                ),
              ),
      child: GradientBackground(
        isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            title: const Text('Bus List'),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () => _refreshBuses(context),
              ),
            ],
          ),
          body: BlocBuilder<GetBusListBloc, GetBusListState>(
            builder: (context, state) {
              if (state is GetBusListLoading && state.buses.isEmpty) {
                return const LoadingWidget();
              } else if (state is GetBusListError) {
                return ErrorWidgetView(
                  errorMessage: state.message,
                  onRetry: () => _refreshBuses(context),
                );
              } else if (state is GetBusListLoaded) {
                return Column(
                  children: [
                    const SizedBox(height: 16),
                    Expanded(child: _buildBusList(context, state)),
                    _buildPaginationControls(context, state),
                  ],
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildBusList(BuildContext context, GetBusListLoaded state) {
    if (state.buses.isEmpty) {
      return const Center(child: Text('No buses available'));
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      itemCount: state.buses.length,
      itemBuilder: (context, index) {
        final bus = state.buses[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 20,
              vertical: 8,
            ),
            leading: const Icon(Icons.directions_bus),
            title: Text(bus.busName),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Plate: ${bus.busNumberPlate}'),
                Text('Type: ${bus.busType} ${bus.busSubType}'),
              ],
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: getStatusColor(bus.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    BusStatusIdentifier.fromValue(bus.status)?.label ?? 'Unknown',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.white,fontWeight: FontWeight.w900),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPaginationControls(
    BuildContext context,
    GetBusListLoaded state,
  ) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Page ${state.currentPage} of ${state.totalPages}',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed:
                    state.currentPage > 1
                        ? () => _loadBuses(context, state.currentPage - 1)
                        : null,
                tooltip: 'Previous Page',
              ),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed:
                    state.hasMore
                        ? () => _loadBuses(context, state.currentPage + 1)
                        : null,
                tooltip: 'Next Page',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
