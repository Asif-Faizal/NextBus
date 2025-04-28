import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'dropdown_selection_cubit.dart';

// Key for bus sub-type in the global selection map
const String busSubTypeKey = 'bus_sub_type';

// Possible bus sub types
enum BusSubType {
  seater('Seater'),
  sleeper('Sleeper');

  final String value;
  const BusSubType(this.value);

  static List<String> get options => BusSubType.values.map((e) => e.value).toList();
}

// State class for bus sub-type selection
class BusSubTypeState extends Equatable {
  final String? selectedSubType;

  const BusSubTypeState({this.selectedSubType});

  @override
  List<Object?> get props => [selectedSubType];
}

// Specialized cubit for bus sub-type selection
class BusSubTypeCubit extends Cubit<BusSubTypeState> {
  final DropdownSelectionCubit globalCubit;

  BusSubTypeCubit({required this.globalCubit}) 
      : super(BusSubTypeState(selectedSubType: globalCubit.getSelection(busSubTypeKey)));

  void selectBusSubType(String? subType) {
    if (subType != null) {
      globalCubit.updateSelection(busSubTypeKey, subType);
      emit(BusSubTypeState(selectedSubType: subType));
    } else {
      globalCubit.clearSelection(busSubTypeKey);
      emit(const BusSubTypeState());
    }
  }

  // Get the current selection from the global cubit
  void refreshFromGlobal() {
    final currentSelection = globalCubit.getSelection(busSubTypeKey);
    emit(BusSubTypeState(selectedSubType: currentSelection));
  }
} 