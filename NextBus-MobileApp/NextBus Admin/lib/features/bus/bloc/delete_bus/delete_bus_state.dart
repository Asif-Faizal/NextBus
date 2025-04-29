part of 'delete_bus_bloc.dart';

abstract class DeleteBusState extends Equatable {
  const DeleteBusState();

  @override
  List<Object?> get props => [];
}

class DeleteBusInitial extends DeleteBusState {}

class DeleteBusLoading extends DeleteBusState {}

class DeleteBusSuccess extends DeleteBusState {
  final BusEntity bus;

  const DeleteBusSuccess(this.bus);

  @override
  List<Object?> get props => [bus];
}

class DeleteBusFailure extends DeleteBusState {
  final String message;

  const DeleteBusFailure(this.message);

  @override
  List<Object?> get props => [message];
}
