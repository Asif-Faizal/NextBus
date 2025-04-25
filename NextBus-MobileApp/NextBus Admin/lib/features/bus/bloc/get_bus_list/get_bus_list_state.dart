part of 'get_bus_list_bloc.dart';

abstract class GetBusListState extends Equatable {
  const GetBusListState();

  @override
  List<Object?> get props => [];
}

class GetBusListInitial extends GetBusListState {}

class GetBusListLoading extends GetBusListState {
  final List<BusEntity> buses;

  const GetBusListLoading({this.buses = const []});

  @override
  List<Object?> get props => [buses];
}

class GetBusListLoaded extends GetBusListState {
  final List<BusEntity> buses;
  final int currentPage;
  final int totalPages;
  final bool hasMore;

  const GetBusListLoaded(
    this.buses, {
    this.currentPage = 1,
    this.totalPages = 1,
    this.hasMore = true,
  });

  @override
  List<Object?> get props => [buses, currentPage, totalPages, hasMore];
}

class GetBusListError extends GetBusListState {
  final String message;

  const GetBusListError(this.message);

  @override
  List<Object?> get props => [message];
}