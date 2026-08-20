using Application.Interfaces;
using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Persistence.Repositories;
public abstract class BaseRepository<TEntity>(DataContext dataContext) : IBaseRepository<TEntity> where TEntity : class
{
    protected readonly DataContext _context = dataContext;
    protected readonly DbSet<TEntity> _dbSet = dataContext.Set<TEntity>();

    public virtual async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);  
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> expression)
    {
        return await _dbSet.FirstOrDefaultAsync(expression);
    }

    public virtual Task UpdateAsync(TEntity entity)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }
    public virtual async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}