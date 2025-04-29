part of 'edit_bus_bloc.dart';

abstract class EditBusState extends Equatable {
  const EditBusState();

  @override
  List<Object?> get props => [];
}

class EditBusInitial extends EditBusState {}

class EditBusLoading extends EditBusState {}

class EditBusLoaded extends EditBusState {
  final BusModel bus;

  const EditBusLoaded(this.bus);

  @override
  List<Object?> get props => [bus];
}

class EditBusError extends EditBusState {
  final String message;

  const EditBusError(this.message);

  @override
  List<Object?> get props => [message];
}