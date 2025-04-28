part of 'get_bus_by_id_bloc.dart';

abstract class GetBusByIdState extends Equatable {
  const GetBusByIdState();

  @override
  List<Object?> get props => [];
}

class GetBusByIdInitial extends GetBusByIdState {}

class GetBusByIdLoading extends GetBusByIdState {}

class GetBusByIdLoaded extends GetBusByIdState {
  final BusEntity bus;

  const GetBusByIdLoaded({required this.bus});
  
  @override
  List<Object?> get props => [bus];
}

class GetBusByIdError extends GetBusByIdState {
  final String message;
  const GetBusByIdError({required this.message});
}