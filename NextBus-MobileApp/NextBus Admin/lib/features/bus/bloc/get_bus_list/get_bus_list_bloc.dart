import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/bus_request_model.dart';
import '../../domain/bus_entity.dart';
import '../../domain/get_buses.dart';

part 'get_bus_list_event.dart';
part 'get_bus_list_state.dart';

class GetBusListBloc extends Bloc<GetBusListEvent, GetBusListState> {
  final GetBusesUseCase getBusesUseCase;
  int _currentPage = 1;
  int _totalPages = 1;
  
  GetBusListBloc({required this.getBusesUseCase}) : super(GetBusListInitial()) {
    on<FetchBuses>((event, emit) async {
      if (event.request.page == 1) {
        emit(GetBusListLoading());
      } else {
        emit(GetBusListLoading(buses: (state as GetBusListLoaded).buses));
      }
      
      final result = await getBusesUseCase(event.request);
      result.fold(
        (error) => emit(GetBusListError(error.toString())),
        (response) {
          _currentPage = response.page;
          _totalPages = response.totalPages;
          
          final hasMore = _currentPage < _totalPages;
          
          emit(GetBusListLoaded(
            response.data,
            currentPage: _currentPage,
            totalPages: _totalPages,
            hasMore: hasMore
          ));
        },
      );
    });
  }
}
