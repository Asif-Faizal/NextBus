import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/widgets/gradient_background.dart';
import 'package:next_bus_admin/core/widgets/error_widget.dart';
import 'package:next_bus_admin/core/widgets/loading_widget.dart';
import 'package:next_bus_admin/features/bus/bloc/get_bus_list/get_bus_list_bloc.dart';
import 'package:next_bus_admin/features/bus/data/bus_request_model.dart';

import '../../../core/theme/theme_cubit.dart';
import '../../../core/utils/bus_status.dart';
import 'bus_details_screen.dart';

class BusScreen extends StatelessWidget {
  const BusScreen({super.key});

  static const int limit = 5;

  void _loadBuses(BuildContext context, int page, {String? busType, String? busSubType, String? busName}) {
    // Get the current filters from the bloc if not provided
    final bloc = context.read<GetBusListBloc>();
    final currentState = bloc.state;
    final currentBusType = busType ?? bloc.busType;
    final currentBusSubType = busSubType ?? bloc.busSubType;
    final currentBusName = busName ?? 
        (currentState is GetBusListLoaded ? (currentState).busName : '');
    
    context.read<GetBusListBloc>().add(
      FetchBuses(
        BusListRequestModel(
          busType: currentBusType,
          busSubType: currentBusSubType,
          busName: currentBusName,
          page: page,
          limit: limit,
        ),
      ),
    );
  }

  void _refreshBuses(BuildContext context) {
    _loadBuses(context, 1);
  }

  void _showFilterDialog(BuildContext context) {
    // Get the current filter values from the bloc
    final bloc = context.read<GetBusListBloc>();
    String selectedBusType = bloc.busType;
    String selectedBusSubType = bloc.busSubType;
    
    showDialog(
      context: context, 
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Filter'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Bus Type', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  RadioListTile<String>(
                    title: const Text('AC'),
                    value: 'AC',
                    groupValue: selectedBusType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusType = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('NON AC'),
                    value: 'NON AC',
                    groupValue: selectedBusType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusType = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('All'),
                    value: '',
                    groupValue: selectedBusType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusType = value!;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  const Text('Bus Sub Type', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  RadioListTile<String>(
                    title: const Text('Seater'),
                    value: 'Seater',
                    groupValue: selectedBusSubType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusSubType = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('Sleeper'),
                    value: 'Sleeper',
                    groupValue: selectedBusSubType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusSubType = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('All'),
                    value: '',
                    groupValue: selectedBusSubType,
                    onChanged: (value) {
                      setState(() {
                        selectedBusSubType = value!;
                      });
                    },
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    // Apply filters
                    _loadBuses(
                      context, 
                      1, 
                      busType: selectedBusType,
                      busSubType: selectedBusSubType,
                    );
                  },
                  child: const Text('Apply'),
                ),
              ],
            );
          }
        );
      }
    );
  }

  @override
  Widget build(BuildContext context) {
    // Force data loading on each screen display with a post-frame callback
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshBuses(context);
    });

    return GradientBackground(
      isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text('Bus List'),
          actions: [
            IconButton(
              icon: const Icon(Icons.filter_list),
              onPressed: () => _showFilterDialog(context),
            ),
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () => _refreshBuses(context),
            ),
          ],
          bottom: PreferredSize(
            preferredSize: Size.fromHeight(50),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: TextFormField(
                decoration: InputDecoration(hintText: 'Search by bus name'),
                onChanged: (value) {
                  _loadBuses(
                    context,
                    1,
                    busName: value,
                  );
                },
              ),
            ),
          ),
        ),
        body: BlocBuilder<GetBusListBloc, GetBusListState>(
          builder: (context, state) {
            if (state is GetBusListInitial) {
              return const LoadingWidget();
            } else if (state is GetBusListLoading && state.buses.isEmpty) {
              return const LoadingWidget();
            } else if (state is GetBusListError) {
              return ErrorWidgetView(
                errorMessage: state.message,
                onRetry: () => _refreshBuses(context),
              );
            } else if (state is GetBusListLoaded) {
              // Show a filter indicator if filters are applied
              return Column(
                children: [
                  if (state.busType.isEmpty && state.busSubType.isEmpty)
                    const SizedBox(height: 16),
                  if (state.busType.isNotEmpty || state.busSubType.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        children: [
                          const Text('Filters: ', style: TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(width: 8),
                          if (state.busType.isNotEmpty)
                            Chip(
                              label: Text(state.busType),
                              deleteIcon: const Icon(Icons.clear, size: 16),
                              onDeleted: () => _loadBuses(
                                context,
                                1,
                                busType: '',
                                busSubType: state.busSubType,
                                busName: state.busName,
                              ),
                            ),
                          if (state.busSubType.isNotEmpty)
                            Chip(
                              label: Text(state.busSubType),
                              deleteIcon: const Icon(Icons.clear, size: 16),
                              onDeleted: () => _loadBuses(
                                context,
                                1,
                                busType: state.busType,
                                busSubType: '',
                                busName: state.busName,
                              ),
                            ),
                        ],
                      ),
                    ),
                  Expanded(child: _buildBusList(context, state)),
                  _buildPaginationControls(context, state),
                ],
              );
            }
            return const SizedBox.shrink();
          },
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
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => BusDetailsScreen(id: bus.id))),
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
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
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
