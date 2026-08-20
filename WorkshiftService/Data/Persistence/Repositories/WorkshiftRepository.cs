using Domain.Entities;
using Application.Interfaces;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

public class WorkshiftRepository(DataContext context) : BaseRepository<WorkshiftEntity>(context), IWorkshiftRepository
{

}
