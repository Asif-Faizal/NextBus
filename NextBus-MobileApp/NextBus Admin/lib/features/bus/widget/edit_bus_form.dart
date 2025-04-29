import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:next_bus_admin/features/bus/domain/bus_entity.dart';

import '../bloc/edit_bus/edit_bus_bloc.dart';
import '../bloc/get_edit_request/get_edit_request_bloc.dart';
import '../cubits/bus_sub_type_cubit.dart';
import '../cubits/bus_type_cubit.dart';
import '../cubits/dropdown_selection_cubit.dart';
import '../data/models/add_bus_model.dart';

class EditBusForm extends StatefulWidget {
  final BusEntity bus;
  final bool readOnly;

  const EditBusForm({
    super.key,
    required this.bus,
    required this.readOnly,
  });

  @override
  State<EditBusForm> createState() => _EditBusFormState();
}

class _EditBusFormState extends State<EditBusForm> {
  late final TextEditingController busNameController;
  late final TextEditingController busNumberPlateController;
  late final TextEditingController busOwnerNameController;
  late final TextEditingController driverNameController;
  late final TextEditingController conductorNameController;

  @override
  void initState() {
    super.initState();
    busNameController = TextEditingController(text: widget.bus.busName);
    busNumberPlateController = TextEditingController(text: widget.bus.busNumberPlate);
    busOwnerNameController = TextEditingController(text: widget.bus.busOwnerName);
    driverNameController = TextEditingController(text: widget.bus.driverName);
    conductorNameController = TextEditingController(text: widget.bus.conductorName);

    if (widget.readOnly) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<GetEditRequestBloc>().add(FetchEditRequest(widget.bus.id));
      });
    }
  }

  @override
  void dispose() {
    busNameController.dispose();
    busNumberPlateController.dispose();
    busOwnerNameController.dispose();
    driverNameController.dispose();
    conductorNameController.dispose();
    super.dispose();
  }

  void _updateControllers(AddBusModel editRequest) {
    setState(() {
      busNameController.text = editRequest.busName;
      busNumberPlateController.text = editRequest.busNumberPlate;
      busOwnerNameController.text = editRequest.busOwnerName;
      driverNameController.text = editRequest.driverName;
      conductorNameController.text = editRequest.conductorName;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 40),
      height: MediaQuery.of(context).size.height * 0.7,
      child: SingleChildScrollView(
        child: Column(
          spacing: 15,
          children: [
            if (widget.readOnly)
              BlocListener<GetEditRequestBloc, GetEditRequestState>(
                listener: (context, state) {
                  if (state is GetEditRequestLoaded) {
                    _updateControllers(state.editRequest);
                  }
                },
                child: BlocBuilder<GetEditRequestBloc, GetEditRequestState>(
                  builder: (context, state) {
                    if (state is GetEditRequestLoading) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (state is GetEditRequestError) {
                      return Center(child: Text(state.message));
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ),
            TextFormField(
              readOnly: widget.readOnly,
              controller: busNameController,
              decoration: const InputDecoration(labelText: 'Bus Name'),
            ),
            TextFormField(
              readOnly: widget.readOnly,
              controller: busNumberPlateController,
              decoration: const InputDecoration(labelText: 'Bus Number Plate'),
            ),
            TextFormField(
              readOnly: widget.readOnly,
              controller: busOwnerNameController,
              decoration: const InputDecoration(labelText: 'Bus Owner Name'),
            ),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    readOnly: widget.readOnly,
                    initialValue: widget.bus.busType,
                    decoration: const InputDecoration(labelText: 'Bus Type'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextFormField(
                    readOnly: widget.readOnly,
                    initialValue: widget.bus.busSubType,
                    decoration: const InputDecoration(labelText: 'Bus Sub-Type'),
                  ),
                ),
              ],
            ),
            TextFormField(
              readOnly: widget.readOnly,
              controller: driverNameController,
              decoration: const InputDecoration(labelText: 'Driver Name'),
            ),
            TextFormField(
              readOnly: widget.readOnly,
              controller: conductorNameController,
              decoration: const InputDecoration(labelText: 'Conductor Name'),
            ),
            const SizedBox(height: 20),
            if (!widget.readOnly)
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
                            id: widget.bus.id,
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
              if (widget.readOnly)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                  },
                  child: const Text('Approve Edit'),
                ),
              )
          ],
        ),
      ),
    );
  }
}
