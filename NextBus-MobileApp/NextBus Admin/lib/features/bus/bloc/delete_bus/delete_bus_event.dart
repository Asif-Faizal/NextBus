part of 'delete_bus_bloc.dart';

abstract class DeleteBusEvent extends Equatable {
  const DeleteBusEvent();

  @override
  List<Object?> get props => [];
}

class DeleteBus extends DeleteBusEvent {
  final String id;

  const DeleteBus({required this.id});
}
