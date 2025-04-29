part of 'approve_delete_bloc.dart';

abstract class ApproveDeleteState extends Equatable {
  const ApproveDeleteState();

  @override
  List<Object?> get props => [];
}

class ApproveDeleteInitial extends ApproveDeleteState {}

class ApproveDeleteLoading extends ApproveDeleteState {}

class ApproveDeleteSuccess extends ApproveDeleteState {
  final String message;

  const ApproveDeleteSuccess({required this.message});

  @override
  List<Object?> get props => [message];
}

class ApproveDeleteFailure extends ApproveDeleteState {
  final String message;

  const ApproveDeleteFailure({required this.message});

  @override
  List<Object?> get props => [message];
}
