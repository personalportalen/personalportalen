using Application.Interfaces;
using Application.Models;
using Infrastructure.Persistance.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Persistance.Repositories;
public class BaseRepository<TEntity>(DataContext context) : IBaseRepository<TEntity> where TEntity : class
{
    protected readonly DataContext _context = context;
    protected readonly DbSet<TEntity> _table = context.Set<TEntity>();

    public async Task<RepositoryResult> AddAsync(TEntity entity)
    {
        if (entity != null)
        {
            try
            {
                await _table.AddAsync(entity);
                await _context.SaveChangesAsync();
                return new RepositoryResult
                {

                    Succeeded = true,
                };
            }
            catch (Exception ex)
            {
                return new RepositoryResult
                {
                    Succeeded = false,
                    Error = ex.Message
                };
            }
        }
        return new RepositoryResult
        {
            Succeeded = false,
            Error = "Entity is null"
        };

    }

    public async Task<RepositoryResult<IEnumerable<TEntity>>> GetAllAsync()
    {
        try
        {
            var entities = await _table.ToListAsync();

            return new RepositoryResult<IEnumerable<TEntity>>
            {
                Succeeded = true,
                Result = entities
            };
        }
        catch (Exception ex)
        {
            return new RepositoryResult<IEnumerable<TEntity>>
            {
                Succeeded = false,
                Error = ex.Message
            };
        }
    }

    public async Task<RepositoryResult<TEntity>> GetAsync(Expression<Func<TEntity, bool>> expression)
    {
        try
        {
            var entity = await _table.FirstOrDefaultAsync(expression);
            return new RepositoryResult<TEntity>
            {
                Succeeded = true,
                Result = entity
            };
        }
        catch (Exception ex)
        {
            return new RepositoryResult<TEntity>
            {
                Succeeded = false,
                Error = ex.Message
            };
        }

    }

    public async Task<RepositoryResult> UpdateAsync(TEntity entity)
    {
        if (entity != null)
        {
            try
            {
                _table.Update(entity);
                return new RepositoryResult
                {
                    Succeeded = true,

                };
            }
            catch (Exception ex)
            {
                return new RepositoryResult
                {
                    Succeeded = false,
                    Error = ex.Message
                };
            }
        }
        return new RepositoryResult
        {
            Succeeded = false,
            Error = "Entity is null"
        };

    }

    public async Task<RepositoryResult> RemoveAsync(TEntity entity)
    {
        if (entity != null)
        {
            try
            {
                _table.Remove(entity);
                return new RepositoryResult
                {
                    Succeeded = true
                };
            }
            catch (Exception ex)
            {
                return new RepositoryResult
                {
                    Succeeded = false,
                    Error = ex.Message
                };
            }
        }
        return new RepositoryResult
        {
            Succeeded = false,
            Error = "Entity is null"
        };
    }
}
