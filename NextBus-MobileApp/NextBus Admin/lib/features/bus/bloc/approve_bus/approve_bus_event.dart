part of 'approve_bus_bloc.dart';


abstract class ApproveBusEvent extends Equatable {
  const ApproveBusEvent();

  @override
  List<Object?> get props => [];
}

class ApproveBus extends ApproveBusEvent {
  final String id;

  const ApproveBus({required this.id});

  @override
  List<Object?> get props => [id];
}
