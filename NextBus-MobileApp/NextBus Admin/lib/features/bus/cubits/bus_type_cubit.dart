import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'dropdown_selection_cubit.dart';

// Key for bus type in the global selection map
const String busTypeKey = 'bus_type';

// Possible bus types
enum BusType {
  ac('AC'),
  nonAc('NON AC');

  final String value;
  const BusType(this.value);

  static List<String> get options => BusType.values.map((e) => e.value).toList();
}

// State class for bus type selection
class BusTypeState extends Equatable {
  final String? selectedType;

  const BusTypeState({this.selectedType});

  @override
  List<Object?> get props => [selectedType];
}

// Specialized cubit for bus type selection
class BusTypeCubit extends Cubit<BusTypeState> {
  final DropdownSelectionCubit globalCubit;

  BusTypeCubit({required this.globalCubit}) 
      : super(BusTypeState(selectedType: globalCubit.getSelection(busTypeKey)));

  void selectBusType(String? type) {
    if (type != null) {
      globalCubit.updateSelection(busTypeKey, type);
      emit(BusTypeState(selectedType: type));
    } else {
      globalCubit.clearSelection(busTypeKey);
      emit(const BusTypeState());
    }
  }

  // Get the current selection from the global cubit
  void refreshFromGlobal() {
    final currentSelection = globalCubit.getSelection(busTypeKey);
    emit(BusTypeState(selectedType: currentSelection));
  }
} 