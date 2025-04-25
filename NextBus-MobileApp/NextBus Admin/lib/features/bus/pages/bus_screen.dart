import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/widgets/gradient_background.dart';
import 'package:next_bus_admin/core/widgets/error_widget.dart';
import 'package:next_bus_admin/core/widgets/loading_widget.dart';
import 'package:next_bus_admin/features/bus/bloc/get_bus_list/get_bus_list_bloc.dart';
import 'package:next_bus_admin/features/bus/data/bus_request_model.dart';

import '../../../core/theme/theme_cubit.dart';

class BusScreen extends StatefulWidget {
  const BusScreen({super.key});

  @override
  State<BusScreen> createState() => _BusScreenState();
}

class _BusScreenState extends State<BusScreen> {
  final int _limit = 5;

  void _loadBuses(int page) {
    setState(() {
    });
    context.read<GetBusListBloc>().add(
          FetchBuses(BusRequestModel(
            busType: '',
            busSubType: '',
            busName: '',
            page: page,
            limit: _limit,
          )),
        );
  }

  void _refreshBuses() {
    _loadBuses(1);
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => context.read<GetBusListBloc>()
        ..add(FetchBuses(BusRequestModel(
          busType: '',
          busSubType: '',
          busName: '',
          page: 1,
          limit: _limit,
        ))),
      child: GradientBackground(
        isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            title: const Text('Bus List'),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: _refreshBuses,
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
                  onRetry: _refreshBuses,
                );
              } else if (state is GetBusListLoaded) {
                return Column(
                  children: [
                    Expanded(
                      child: _buildBusList(state),
                    ),
                    _buildPaginationControls(state),
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

  Widget _buildBusList(GetBusListLoaded state) {
    if (state.buses.isEmpty) {
      return const Center(
        child: Text('No buses available'),
      );
    }

    return ListView.builder(
      itemCount: state.buses.length,
      itemBuilder: (context, index) {
        final bus = state.buses[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            leading: const Icon(Icons.directions_bus),
            title: Text(bus.busName),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Plate: ${bus.busNumberPlate}'),
                Text('Type: ${bus.busType}'),
                Text('Driver: ${bus.driverName}'),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPaginationControls(GetBusListLoaded state) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
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
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: state.currentPage > 1
                    ? () => _loadBuses(state.currentPage - 1)
                    : null,
                tooltip: 'Previous Page',
              ),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: state.hasMore
                    ? () => _loadBuses(state.currentPage + 1)
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