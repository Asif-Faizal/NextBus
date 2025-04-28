import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// State class for dropdown selection
class DropdownSelectionState extends Equatable {
  final Map<String, String> selections;

  const DropdownSelectionState({this.selections = const {}});

  DropdownSelectionState copyWith({
    Map<String, String>? selections,
  }) {
    return DropdownSelectionState(
      selections: selections ?? this.selections,
    );
  }

  @override
  List<Object?> get props => [selections];
}

// Global Cubit to manage dropdown selections
class DropdownSelectionCubit extends Cubit<DropdownSelectionState> {
  DropdownSelectionCubit() : super(const DropdownSelectionState());

  void updateSelection(String key, String value) {
    final updatedSelections = Map<String, String>.from(state.selections);
    updatedSelections[key] = value;
    emit(state.copyWith(selections: updatedSelections));
  }

  void clearSelection(String key) {
    final updatedSelections = Map<String, String>.from(state.selections);
    updatedSelections.remove(key);
    emit(state.copyWith(selections: updatedSelections));
  }

  void clearAllSelections() {
    emit(const DropdownSelectionState());
  }

  String? getSelection(String key) {
    return state.selections[key];
  }
} 