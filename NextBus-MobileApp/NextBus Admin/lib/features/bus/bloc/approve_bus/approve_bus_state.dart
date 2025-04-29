part of 'approve_bus_bloc.dart';


abstract class ApproveBusState extends Equatable {
  const ApproveBusState();

  @override
  List<Object?> get props => [];
}

class ApproveBusInitial extends ApproveBusState {}

class ApproveBusLoading extends ApproveBusState {}

class ApproveBusSuccess extends ApproveBusState {
  final BusModel bus;

  const ApproveBusSuccess({required this.bus});

  @override
  List<Object?> get props => [bus];
}

class ApproveBusFailure extends ApproveBusState {
  final String message;

  const ApproveBusFailure({required this.message});

  @override
  List<Object?> get props => [message];
}