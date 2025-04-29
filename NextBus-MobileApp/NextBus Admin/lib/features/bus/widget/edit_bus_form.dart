import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/features/bus/domain/bus_entity.dart';

import '../bloc/edit_bus/edit_bus_bloc.dart';
import '../cubits/bus_sub_type_cubit.dart';
import '../cubits/bus_type_cubit.dart';
import '../cubits/dropdown_selection_cubit.dart';
import '../data/models/add_bus_model.dart';

class EditBusForm extends StatelessWidget {
  final BusEntity bus;
  final bool readOnly;
  final TextEditingController busNameController;
  final TextEditingController busNumberPlateController;
  final TextEditingController busOwnerNameController;
  final TextEditingController driverNameController;
  final TextEditingController conductorNameController;

  EditBusForm({
    super.key,
    required this.bus,
    required this.readOnly,
  })
    : busNameController = TextEditingController(text: bus.busName),
      busNumberPlateController = TextEditingController(
        text: bus.busNumberPlate,
      ),
      busOwnerNameController = TextEditingController(text: bus.busOwnerName),
      driverNameController = TextEditingController(text: bus.driverName),
      conductorNameController = TextEditingController(text: bus.conductorName);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 40),
      height: MediaQuery.of(context).size.height * 0.7,
      child: SingleChildScrollView(
        child: Column(
          spacing: 15,
          children: [
            TextFormField(
              controller: busNameController,
              decoration: const InputDecoration(labelText: 'Bus Name'),
            ),
            TextFormField(
              readOnly: readOnly,
              controller: busNumberPlateController,
              decoration: const InputDecoration(labelText: 'Bus Number Plate'),
            ),
            TextFormField(
              readOnly: readOnly,
              controller: busOwnerNameController,
              decoration: const InputDecoration(labelText: 'Bus Owner Name'),
            ),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    readOnly: readOnly,
                    initialValue: bus.busType,
                    decoration: const InputDecoration(labelText: 'Bus Type'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextFormField(
                    readOnly: readOnly,
                    initialValue: bus.busSubType,
                    decoration: const InputDecoration(labelText: 'Bus Sub-Type'),
                  ),
                ),
              ],
            ),
            TextFormField(
              readOnly: readOnly,
              controller: driverNameController,
              decoration: const InputDecoration(labelText: 'Driver Name'),
            ),
            TextFormField(
              readOnly: readOnly,
              controller: conductorNameController,
              decoration: const InputDecoration(labelText: 'Conductor Name'),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: Builder(
                builder: (context) {
                  final globalCubit = context.watch<DropdownSelectionCubit>();
                  return ElevatedButton(
                    onPressed: () {
                      final busType =
                          globalCubit.getSelection(busTypeKey) ?? '';
                      final busSubType =
                          globalCubit.getSelection(busSubTypeKey) ?? '';
                      context.read<EditBusBloc>().add(
                        EditBus(
                          id: bus.id,
                          request: AddBusModel(
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
                    child: BlocBuilder<EditBusBloc, EditBusState>(
                      builder: (context, state) {
                        if (state is EditBusLoading) {
                          return const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(),
                          );
                        }
                        return const Text('Request for Edit');
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
