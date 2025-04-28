part of 'add_new_bus_bloc.dart';

abstract class AddNewBusEvent extends Equatable {
  const AddNewBusEvent();

  @override
  List<Object?> get props => [];
}

class AddNewBus extends AddNewBusEvent {
  final AddBusModel request;

  const AddNewBus(this.request);

  @override
  List<Object?> get props => [request];
}