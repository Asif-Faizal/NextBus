part of 'add_new_bus_bloc.dart';

abstract class AddNewBusState extends Equatable {
  const AddNewBusState();

  @override
  List<Object?> get props => [];
}

class AddNewBusInitial extends AddNewBusState {}

class AddNewBusLoading extends AddNewBusState {}

class AddNewBusSuccess extends AddNewBusState {
  final BusEntity bus;

  const AddNewBusSuccess(this.bus);

  @override
  List<Object?> get props => [bus];
}

class AddNewBusFailure extends AddNewBusState {
  final String message;

  const AddNewBusFailure(this.message);

  @override
  List<Object?> get props => [message];
}
