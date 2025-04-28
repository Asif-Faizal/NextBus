part of 'get_bus_by_id_bloc.dart';


abstract class GetBusByIdEvent extends Equatable {
  const GetBusByIdEvent();

  @override
  List<Object?> get props => [];
}

class FetchBusById extends GetBusByIdEvent {
  final String id;

  const FetchBusById(this.id);
}