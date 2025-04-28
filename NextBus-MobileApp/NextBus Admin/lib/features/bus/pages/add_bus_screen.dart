import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/core/widgets/error_snackbar.dart';

import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/gradient_background.dart';
import '../bloc/add_new_bus/add_new_bus_bloc.dart';
import '../bloc/get_bus_list/get_bus_list_bloc.dart';
import '../data/add_bus_model.dart';
import '../cubits/dropdown_selection_cubit.dart';
import '../cubits/bus_type_cubit.dart';
import '../cubits/bus_sub_type_cubit.dart';
import '../data/bus_request_model.dart';

class AddBusScreen extends StatelessWidget {
  AddBusScreen({super.key});
  final TextEditingController busNumberPlateController =
      TextEditingController();
  final TextEditingController busNameController = TextEditingController();
  final TextEditingController busOwnerNameController = TextEditingController();
  final TextEditingController driverNameController = TextEditingController();
  final TextEditingController conductorNameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    // Provide the cubits
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => DropdownSelectionCubit()),
        BlocProvider(
          create:
              (context) => BusTypeCubit(
                globalCubit: context.read<DropdownSelectionCubit>(),
              ),
        ),
        BlocProvider(
          create:
              (context) => BusSubTypeCubit(
                globalCubit: context.read<DropdownSelectionCubit>(),
              ),
        ),
      ],
      child: GradientBackground(
        isDarkMode: context.watch<ThemeCubit>().state.isDarkMode,
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(title: const Text('Add Bus')),
          body: BlocListener<AddNewBusBloc, AddNewBusState>(
            listener: (context, state) {
              if (state is AddNewBusSuccess) {
                context.read<DropdownSelectionCubit>().clearAllSelections();
                context.read<GetBusListBloc>().add(
                  FetchBuses(
                    BusListRequestModel(
                      busType: '',
                      busSubType: '',
                      busName: '',
                      page: 1,
                      limit: 5,
                    ),
                  ),
                );
                Navigator.pop(context);
              } else if (state is AddNewBusFailure) {
                showErrorSnackBar(context, state.message);
              }
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
              child: ListView(
                children: [
                  TextField(
                    controller: busNumberPlateController,
                    decoration: const InputDecoration(labelText: 'Bus Number'),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: busNameController,
                    decoration: const InputDecoration(labelText: 'Bus Name'),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: busOwnerNameController,
                    decoration: const InputDecoration(
                      labelText: 'Bus Owner Name',
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: BlocBuilder<BusTypeCubit, BusTypeState>(
                          builder: (context, state) {
                            return DropdownButtonFormField<String>(
                              value: state.selectedType,
                              hint: const Text('Bus Type'),
                              items:
                                  BusType.options.map((String value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(value),
                                    );
                                  }).toList(),
                              onChanged: (String? value) {
                                context.read<BusTypeCubit>().selectBusType(
                                  value,
                                );
                              },
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: BlocBuilder<BusSubTypeCubit, BusSubTypeState>(
                          builder: (context, state) {
                            return DropdownButtonFormField<String>(
                              value: state.selectedSubType,
                              hint: const Text('Bus Sub-Type'),
                              items:
                                  BusSubType.options.map((String value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(value),
                                    );
                                  }).toList(),
                              onChanged: (String? value) {
                                context
                                    .read<BusSubTypeCubit>()
                                    .selectBusSubType(value);
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: driverNameController,
                    decoration: const InputDecoration(labelText: 'Driver Name'),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: conductorNameController,
                    decoration: const InputDecoration(
                      labelText: 'Conductor Name',
                    ),
                  ),
                ],
              ),
            ),
          ),
          bottomNavigationBar: Builder(
            builder: (context) {
              // Access the global cubit to get selections when submitting
              final globalCubit = context.watch<DropdownSelectionCubit>();

              return BottomAppBar(
                color: Colors.transparent,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 5,
                  ),
                  child: ElevatedButton(
                    onPressed: () {
                      // Get the selected values from the global cubit
                      final busType =
                          globalCubit.getSelection(busTypeKey) ?? '';
                      final busSubType =
                          globalCubit.getSelection(busSubTypeKey) ?? '';

                      context.read<AddNewBusBloc>().add(
                        AddNewBus(
                          AddBusModel(
                            busName: busNameController.text,
                            busNumberPlate: busNumberPlateController.text,
                            busOwnerName: busOwnerNameController.text,
                            busType: busType,
                            busSubType: busSubType,
                            driverName: driverNameController.text,
                            conductorName: conductorNameController.text,
                          ),
                        ),
                      );
                    },
                    child: BlocBuilder<AddNewBusBloc, AddNewBusState>(
                      builder: (context, state) {
                        if (state is AddNewBusLoading) {
                          return const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(),
                          );
                        }
                        return const Text('Add Bus');
                      },
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
