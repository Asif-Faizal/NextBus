part of 'get_bus_list_bloc.dart';

abstract class GetBusListEvent extends Equatable {
  const GetBusListEvent();

  @override
  List<Object?> get props => [];
}

class FetchBuses extends GetBusListEvent {
  final BusRequestModel request;

  const FetchBuses(this.request);

  @override
  List<Object?> get props => [request];
}