part of 'edit_bus_bloc.dart';

abstract class EditBusEvent extends Equatable {
  const EditBusEvent();

  @override
  List<Object?> get props => [];
}

class EditBus extends EditBusEvent {
  final String id;
  final AddBusModel request;

  const EditBus({required this.id, required this.request});
}